import struct
import json
import math
import os

def create_sagar_avatar_glb(output_path):
    # Create geometry for a 3D bust/head avatar
    # Vertices, Normals, UVs, Indices
    positions = []
    normals = []
    uvs = []
    indices = []

    # 1. Head Sphere (lat/long grid)
    lat_steps = 32
    lon_steps = 32
    head_start_idx = len(positions) // 3

    for i in range(lat_steps + 1):
        lat = (i / lat_steps) * math.pi
        sin_lat = math.sin(lat)
        cos_lat = math.cos(lat)

        for j in range(lon_steps + 1):
            lon = (j / lon_steps) * 2 * math.pi
            sin_lon = math.sin(lon)
            cos_lon = math.cos(lon)

            # Head shape scaling (proportions: slightly elongated, chin contoured)
            rx = 0.55 * sin_lat * cos_lon
            ry = 0.70 * cos_lat + 0.35  # Centered at y=0.35
            rz = 0.60 * sin_lat * sin_lon

            # Subtle chin sculpting
            if ry < 0.1 and rz > 0:
                rz *= 1.15
                rx *= 0.9

            positions.extend([rx, ry, rz])

            # Normal vector
            nx = sin_lat * cos_lon
            ny = cos_lat
            nz = sin_lat * sin_lon
            length = math.sqrt(nx*nx + ny*ny + nz*nz) or 1.0
            normals.extend([nx/length, ny/length, nz/length])

            # UV coordinates
            uvs.extend([j / lon_steps, 1.0 - (i / lat_steps)])

    for i in range(lat_steps):
        for j in range(lon_steps):
            first = head_start_idx + (i * (lon_steps + 1)) + j
            second = first + lon_steps + 1

            indices.extend([first, second, first + 1])
            indices.extend([second, second + 1, first + 1])

    # 2. Torso / Suit Shoulders (Cylinder base)
    torso_start_idx = len(positions) // 3
    torso_rings = 8
    torso_segs = 32

    for r in range(torso_rings + 1):
        v = r / torso_rings
        y = -0.15 - v * 0.95  # y from -0.15 down to -1.10
        # Shoulders widen
        radius_x = 0.45 + v * 0.75
        radius_z = 0.35 + v * 0.35

        for s in range(torso_segs + 1):
            u = s / torso_segs
            theta = u * 2 * math.pi
            rx = radius_x * math.cos(theta)
            ry = y
            rz = radius_z * math.sin(theta)

            positions.extend([rx, ry, rz])
            nx = math.cos(theta)
            ny = 0.1
            nz = math.sin(theta)
            length = math.sqrt(nx*nx + ny*ny + nz*nz) or 1.0
            normals.extend([nx/length, ny/length, nz/length])
            uvs.extend([u, v])

    for r in range(torso_rings):
        for s in range(torso_segs):
            first = torso_start_idx + (r * (torso_segs + 1)) + s
            second = first + torso_segs + 1

            indices.extend([first, second, first + 1])
            indices.extend([second, second + 1, first + 1])

    # Convert to binary buffers
    # positions: float32, normals: float32, uvs: float32, indices: uint16
    pos_bytes = struct.pack(f'<{len(positions)}f', *positions)
    norm_bytes = struct.pack(f'<{len(normals)}f', *normals)
    uv_bytes = struct.pack(f'<{len(uvs)}f', *uvs)
    idx_bytes = struct.pack(f'<{len(indices)}H', *indices)

    # Pad each buffer to 4 bytes
    def pad4(b):
        pad = (4 - (len(b) % 4)) % 4
        return b + b'\x00' * pad

    pos_pad = pad4(pos_bytes)
    norm_pad = pad4(norm_bytes)
    uv_pad = pad4(uv_bytes)
    idx_pad = pad4(idx_bytes)

    total_bin = pos_pad + norm_pad + uv_pad + idx_pad

    offset_pos = 0
    offset_norm = len(pos_pad)
    offset_uv = offset_norm + len(norm_pad)
    offset_idx = offset_uv + len(uv_pad)

    # Calculate min/max for positions
    num_verts = len(positions) // 3
    min_x = min(positions[0::3])
    max_x = max(positions[0::3])
    min_y = min(positions[1::3])
    max_y = max(positions[1::3])
    min_z = min(positions[2::3])
    max_z = max(positions[2::3])

    gltf = {
        "asset": {
            "version": "2.0",
            "generator": "Sagar Singh 3D Avatar Pipeline"
        },
        "scene": 0,
        "scenes": [{ "name": "AvatarScene", "nodes": [0] }],
        "nodes": [{
            "name": "SagarAvatarMesh",
            "mesh": 0,
            "translation": [0.0, 0.0, 0.0]
        }],
        "meshes": [{
            "name": "SagarAvatarGeometry",
            "primitives": [{
                "attributes": {
                    "POSITION": 0,
                    "NORMAL": 1,
                    "TEXCOORD_0": 2
                },
                "indices": 3,
                "material": 0,
                "mode": 4
            }]
        }],
        "materials": [{
            "name": "SagarAvatarMaterial",
            "pbrMetallicRoughness": {
                "baseColorFactor": [0.85, 0.65, 0.55, 1.0],
                "roughnessFactor": 0.55,
                "metallicFactor": 0.05
            },
            "doubleSided": True
        }],
        "accessors": [
            {
                "bufferView": 0,
                "byteOffset": 0,
                "componentType": 5126, # FLOAT
                "count": num_verts,
                "type": "VEC3",
                "max": [max_x, max_y, max_z],
                "min": [min_x, min_y, min_z]
            },
            {
                "bufferView": 1,
                "byteOffset": 0,
                "componentType": 5126, # FLOAT
                "count": num_verts,
                "type": "VEC3"
            },
            {
                "bufferView": 2,
                "byteOffset": 0,
                "componentType": 5126, # FLOAT
                "count": num_verts,
                "type": "VEC2"
            },
            {
                "bufferView": 3,
                "byteOffset": 0,
                "componentType": 5123, # UNSIGNED_SHORT
                "count": len(indices),
                "type": "SCALAR"
            }
        ],
        "bufferViews": [
            { "buffer": 0, "byteOffset": offset_pos, "byteLength": len(pos_bytes), "target": 34962 },
            { "buffer": 0, "byteOffset": offset_norm, "byteLength": len(norm_bytes), "target": 34962 },
            { "buffer": 0, "byteOffset": offset_uv, "byteLength": len(uv_bytes), "target": 34962 },
            { "buffer": 0, "byteOffset": offset_idx, "byteLength": len(idx_bytes), "target": 34963 }
        ],
        "buffers": [{ "byteLength": len(total_bin) }]
    }

    json_str = json.dumps(gltf, separators=(',', ':'))
    json_bytes = json_str.encode('utf-8')
    json_pad = pad4(json_bytes)

    total_len = 12 + 8 + len(json_pad) + 8 + len(total_bin)

    header = struct.pack('<4sII', b'glTF', 2, total_len)
    chunk0_hdr = struct.pack('<II', len(json_pad), 0x4E4F534A) # JSON
    chunk1_hdr = struct.pack('<II', len(total_bin), 0x004E4942) # BIN

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, 'wb') as f:
        f.write(header)
        f.write(chunk0_hdr)
        f.write(json_pad)
        f.write(chunk1_hdr)
        f.write(total_bin)

    print(f"GLB avatar created successfully: {output_path} ({total_len} bytes)")

if __name__ == "__main__":
    create_sagar_avatar_glb("public/models/sagar-avatar.glb")
    create_sagar_avatar_glb("frontend/public/models/sagar-avatar.glb")

