import os
import json
import sys
import shutil
import re
from pathlib import Path
from datetime import datetime

def build_index(assets_dir, output_file, public_icons_dir):
    if not os.path.isdir(assets_dir):
        return

    index_data = {
        "Regular": [], 
        "Filled": [],
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    asset_path = Path(assets_dir)
    folders = sorted([f for f in asset_path.iterdir() if f.is_dir()])
    total = len(folders)

    print("Step 1: Scanning folders and building index...")
    for i, folder in enumerate(folders):
        meta_file = folder / "metadata.json"
        svg_dir = folder / "SVG"
        
        if meta_file.exists() and svg_dir.exists():
            try:
                with open(meta_file, 'r', encoding='utf-8') as f:
                    meta = json.load(f)
                
                name = meta.get("name")
                metaphors = meta.get("metaphor", [])
                
                svg_files = [f.name for f in svg_dir.glob("*.svg")]
                
                styles = ["Regular", "Filled"]
                for style in styles:
                    style_lower = style.lower()
                    pattern = re.compile(rf"_(\d+)_{style_lower}\.svg$")
                    
                    style_svgs = []
                    for f_name in svg_files:
                        match = pattern.search(f_name)
                        if match:
                            size = int(match.group(1))
                            style_svgs.append((size, f_name))
                    
                    if style_svgs:
                        smallest_svg = min(style_svgs, key=lambda x: x[0])[1]
                        index_data[style].append({
                            "name": name,
                            "icon": smallest_svg,
                            "metaphor": metaphors,
                            "folder": folder.name
                        })
            except:
                pass

        if (i + 1) % 50 == 0 or (i + 1) == total:
            progress = (i + 1) / total
            bar = '█' * int(40 * progress) + '-' * (40 - int(40 * progress))
            sys.stdout.write(f'\rProgress: |{bar}| {i + 1}/{total} ({progress:.1%})')
            sys.stdout.flush()

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, separators=(',', ':'))
    
    print("\n\nStep 2: Copying all folders to public/icons...")
    if os.path.exists(public_icons_dir):
        shutil.rmtree(public_icons_dir)
    os.makedirs(public_icons_dir, exist_ok=True)

    for i, folder in enumerate(folders):
        dest_folder = Path(public_icons_dir) / folder.name
        shutil.copytree(folder, dest_folder, dirs_exist_ok=True)
        
        if (i + 1) % 50 == 0 or (i + 1) == total:
            progress = (i + 1) / total
            bar = '█' * int(40 * progress) + '-' * (40 - int(40 * progress))
            sys.stdout.write(f'\rProgress: |{bar}| {i + 1}/{total} ({progress:.1%})')
            sys.stdout.flush()
    
    print("\nDone!")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        build_index(
            sys.argv[1], 
            os.path.join(base_dir, "src", "data", "icons-index.json"),
            os.path.join(base_dir, "public", "icons")
        )
