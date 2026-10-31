import os
import glob
from PIL import Image

frames_dir = r"C:\Users\ADMIN\.gemini\antigravity\brain\c096a0d1-ec7a-4298-9784-66cde1f39154\all_frames_10fps"
files = sorted(glob.glob(os.path.join(frames_dir, "f_*.png")))

out_dir = r"C:\Users\ADMIN\.gemini\antigravity\brain\c096a0d1-ec7a-4298-9784-66cde1f39154\detected_cursors"
os.makedirs(out_dir, exist_ok=True)

# The pen cursor is at 45 degrees angle: line from (x, y) to (x+15, y-15) or similar.
# A hand cursor has horizontal or vertical fingers.
# Let's inspect the diff between consecutive frames around the writing area (x: 1800..2500, y: 700..1100).
# In each frame, find pixels that are newly drawn or cursor.

print(f"Analyzing {len(files)} frames...")

for idx in range(1, len(files)):
    f_prev = files[idx - 1]
    f_curr = files[idx]
    
    # We can crop the writing area
    im_curr = Image.open(f_curr).crop((1800, 700, 2500, 1100))
    im_prev = Image.open(f_prev).crop((1800, 700, 2500, 1100))
    
    # Find diff pixels
    diff = Image.new("RGB", im_curr.size)
    # Check pixels of cursor: cursor has dark outline and white inside, or grab hand
    # Let's save a crop centered on the cursor if detected
