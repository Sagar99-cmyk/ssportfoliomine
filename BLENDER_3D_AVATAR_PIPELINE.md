# Sagar Singh — Realistic 3D Digital Avatar Integration Pipeline
*Complete Implementation Guide: Video-Based Facial Reference · Blender 4.x + KeenTools FaceBuilder · Three.js & React WebGL Integration*

---

## 1. Executive Summary & Architecture

This pipeline integrates a highly realistic, interactive 3D digital avatar of **Sagar Singh** into his Data Analytics & BI Engineering portfolio. The system combines:

1. **Identity & Facial Proportions**: Reconstructed faithfully from the uploaded reference video (`sagar-avatar-demo.mp4`) and high-resolution studio photographs (`profile-transparent-open.png`).
2. **Real-Time WebGL 3D Avatar (`Realistic3DAvatar.tsx`)**:
   - 85mm portrait telephoto studio lens perspective (`PerspectiveCamera(38, ...)`).
   - Dynamic 3-point studio lighting (Warm Key softbox, Cool Fill, Crimson `#e11d48` rim kicker) that dynamically shifts tone in Light Mode and Dark Mode.
   - High-end physical shading with subsurface scattering (`MeshPhysicalMaterial`) and procedural micro-skin pore roughness maps.
   - Sagar's authentic photographic facial projection mapped onto a conformed 3D facial mesh.
   - Natural human blinking with randomized intervals (3.5s to 6.5s) and natural double blinks.
   - Restrained pointer and touch head tracking (pitch, yaw, roll) with organic micro-saccades and chest breathing.
   - Interactive expressions: `Confident`, `Smile`, `Thinking`, `Wink`, plus click-to-nod gesture.
3. **Dual-Mode Experience Switcher (`Sagar3DModelCanvas.tsx`)**:
   - `[ 3D WebGL Avatar ]`: Interactive Three.js digital human with gaze tracking and expressions.
   - `[ Living Twin ]`: High-definition photographic portrait with CSS 3D perspective tilt and eye blinks.
   - `[ Reference Demo ]`: One-click modal playing the original reference video (`sagar-avatar-demo.mp4`).
4. **GLB / glTF Asset Pipeline**:
   - Model endpoint: `/models/sagar-avatar.glb`.
   - Automated Blender pipeline script: `scripts/blender_facebuilder_pipeline.py`.
   - Standalone GLB binary builder: `scripts/build_sagar_avatar_glb.py`.

---

## 2. Reference Material & Identity Integrity

- **Video Reference**: `public/videos/sagar-avatar-demo.mp4` (2.77 MB).
- **High-Resolution Portrait Cutouts**:
  - `public/profile-transparent-open.png` (Default open-eyed confident expression).
  - `public/profile-transparent-closed.png` (Natural eyelid closed for blinking).
- **Facial Features Preserved**:
  - Oval face shape with sculpted jawline and slight upward chin posture.
  - Short-trimmed, clean-cut dark hair and natural hairline.
  - Warm brown eyes with specular catchlight highlights.
  - Formal navy/black blazer with school crest insignia badge, white collared shirt, and rich crimson satin necktie.

---

## 3. Blender 4.x + KeenTools FaceBuilder Modelling Workflow

To further refine the 3D head geometry or bake new custom UV textures in Blender:

### Step 1: Install KeenTools FaceBuilder
1. Download **KeenTools FaceBuilder for Blender** (compatible with Blender 4.0 - 4.2+).
2. In Blender: `Edit > Preferences > Add-ons > Install...` and select the `.zip` file.
3. Enable **KeenTools FaceBuilder**.

### Step 2: Camera & Reference Setup
1. Run the included automation script:
   ```bash
   blender --python scripts/blender_facebuilder_pipeline.py
   ```
2. In the 3D Viewport, press `N` to open the sidebar and navigate to the **FaceBuilder** tab.
3. Click **Create Head**.
4. Click **Add View** and import reference frames extracted from `public/videos/sagar-avatar-demo.mp4`:
   - View 1: Frontal portrait (0° yaw).
   - View 2: Left 3/4 angle (+30° yaw).
   - View 3: Right 3/4 angle (-30° yaw).

### Step 3: Pinning & Facial Alignment
1. In each camera view, drag the wireframe pin points to match Sagar's features:
   - Align eye corners, iris centers, and eyelid contours.
   - Position nose bridge and nostril wings.
   - Fit lip corners and mouth line to Sagar's subtle smile.
   - Adjust jawline curve and chin prominence.
2. Ensure the pinhead adheres to the skull volume without flattening.

### Step 4: Facial Shape Keys (Blendshapes)
In the Mesh Data tab (`Object Data Properties > Shape Keys`):
- `Basis`: Neutral expression.
- `eyeBlinkLeft` & `eyeBlinkRight`: Eyelids naturally closing over the eyeball curvature.
- `mouthSmileLeft` & `mouthSmileRight`: Lip corners lifting toward cheekbones.
- `jawOpen`: Subtle jaw drop (max 0.2 units for conversational movement).
- `browInnerUp`: Slight eyebrow elevation for thoughtful expressions.

### Step 5: Texture Baking
1. In FaceBuilder sidebar: click **Texture**.
2. Select **Bake Texture** with resolution `2048x2048`.
3. Save the baked diffuse map as `sagar_face_diffuse.png`.
4. Connect into a `Principled BSDF` with:
   - Subsurface Weight: `0.08`
   - Subsurface Color: `#c88f6c`
   - Roughness: `0.55` (controlled by pore roughness map)
   - Specular IOR Level: `0.5`

### Step 6: GLTF 2.0 / GLB Export
Export via Blender:
- Format: `glTF Binary (.glb)`
- Filepath: `public/models/sagar-avatar.glb`
- Include: Selected Objects, Shape Keys (Morph Targets), Draco Mesh Compression.

---

## 4. Frontend Integration & Theme Support

### Three.js Components
- **`Realistic3DAvatar.tsx`**:
  - Implements the complete WebGL scene, lighting, animation loop, and gaze tracking.
  - Automatically listens to theme changes via `useTheme()`. In **Light Mode**, key and ambient lights increase exposure and shift to crisp neutral daylight tones; in **Dark Mode**, the signature cyber crimson rim kicker (`#e11d48`) and halo illuminate the silhouette.
- **`Sagar3DModelCanvas.tsx`**:
  - Renders the interactive mode switcher (`3D WebGL Avatar` vs `Living Twin`), allowing visitors to enjoy both real-time 3D geometry and the high-resolution photo profile.
  - Includes a quick-access button to open the reference demo video.
- **`ProjectsGallery.tsx`**:
  - Features the 3D Concave Strip Gallery (`ShakuroWorksGallery.tsx`) with real-time drag inertia, card bowing, pixel dissolve viewer, and full case study modals.

---

## 5. Acceptance & Verification Checklist

- [x] Visible resemblance to Sagar Singh's actual uploaded video and photographs.
- [x] WebGL Three.js real-time rendering with 60 FPS performance and ACESFilmic tone mapping.
- [x] Light and Dark theme responsiveness with zero background box or flash.
- [x] Restrained pointer/touch gaze tracking with natural clamp limits.
- [x] Interactive expression chips and friendly click-to-nod gesture.
- [x] Production build tested and verified without console errors or broken assets.
