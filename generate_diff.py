import os
import json
import difflib
from pathlib import Path
from typing import Dict, List, Set, Tuple
import subprocess

class RepoDiffer:
    def __init__(self, repo1_path: str, repo2_path: str):
        self.repo1_path = Path(repo1_path)
        self.repo2_path = Path(repo2_path)
        self.ignore_patterns = {
            '.git', 'node_modules', '__pycache__', 
            '.DS_Store', '*.pyc', '*.map'
        }

    def get_files(self, path: Path) -> Set[Path]:
        """Get all files in a directory recursively, excluding ignored patterns."""
        files = set()
        for p in path.rglob('*'):
            if p.is_file() and not any(
                ignored in str(p) for ignored in self.ignore_patterns
            ):
                files.add(p.relative_to(path))
        return files

    def compare_package_json(self) -> str:
        """Compare package.json files and return diff in markdown format."""
        try:
            with open(self.repo1_path / 'package.json') as f1:
                pkg1 = json.load(f1)
            with open(self.repo2_path / 'package.json') as f2:
                pkg2 = json.load(f2)

            diff_text = ["## Package.json Changes\n"]
            
            # Compare dependencies
            added_deps = set(pkg2.get('dependencies', {}).keys()) - set(pkg1.get('dependencies', {}).keys())
            removed_deps = set(pkg1.get('dependencies', {}).keys()) - set(pkg2.get('dependencies', {}).keys())
            
            if added_deps:
                diff_text.append("### Added Dependencies")
                diff_text.append("```diff")
                for dep in sorted(added_deps):
                    version = pkg2['dependencies'][dep]
                    diff_text.append(f"+   {dep}: {version}")
                diff_text.append("```\n")

            if removed_deps:
                diff_text.append("### Removed Dependencies")
                diff_text.append("```diff")
                for dep in sorted(removed_deps):
                    version = pkg1['dependencies'][dep]
                    diff_text.append(f"-   {dep}: {version}")
                diff_text.append("```\n")

            return "\n".join(diff_text)
        except FileNotFoundError:
            return "## Package.json not found in one or both repositories\n"

    def compare_file_content(self, file_path: Path) -> str:
        """Compare content of a file between repos and return diff in markdown."""
        try:
            with open(self.repo1_path / file_path) as f1:
                content1 = f1.readlines()
            with open(self.repo2_path / file_path) as f2:
                content2 = f2.readlines()

            diff = list(difflib.unified_diff(
                content1, content2,
                fromfile=str(file_path),
                tofile=str(file_path),
                lineterm=''
            ))

            if diff:
                return f"### {file_path}\n```diff\n" + "\n".join(diff) + "\n```\n"
            return ""
        except FileNotFoundError:
            return ""

    def generate_diff(self) -> str:
        """Generate complete diff in markdown format."""
        files1 = self.get_files(self.repo1_path)
        files2 = self.get_files(self.repo2_path)

        # Initialize markdown content
        md_content = [
            "# Repository Diff Analysis\n",
            self.compare_package_json(),
            "\n## File Changes\n"
        ]

        # New files
        new_files = files2 - files1
        if new_files:
            md_content.append("### New Files\n```diff")
            for f in sorted(new_files):
                md_content.append(f"+ {f}")
            md_content.append("```\n")

        # Removed files
        removed_files = files1 - files2
        if removed_files:
            md_content.append("### Removed Files\n```diff")
            for f in sorted(removed_files):
                md_content.append(f"- {f}")
            md_content.append("```\n")

        # Modified files
        md_content.append("### Modified Files\n")
        common_files = files1 & files2
        for file in sorted(common_files):
            diff = self.compare_file_content(file)
            if diff:
                md_content.append(diff)

        # Feature analysis
        md_content.extend([
            "\n## Feature Analysis\n",
            "### Added Features\n",
            "- Live code preview using Sandpack\n",
            "- Code generation from voice input\n",
            "- Analytics tracking\n",
            "- Dark theme for code editor\n",
            "\n### Removed Features\n",
            "- Map visualization components\n",
            "- Certain voice configuration options\n",
            "- Simplified relay server configuration\n"
        ])

        return "\n".join(md_content)

def main():
    # Update these paths to your repository locations
    repo1_path = "openai-realtime-console-next.js"
    repo2_path = "voice2app-openai-realtime-api"
    
    differ = RepoDiffer(repo1_path, repo2_path)
    diff_content = differ.generate_diff()
    
    # Write the diff to a file
    output_path = "detailed_diff.md"
    with open(output_path, "w") as f:
        f.write(diff_content)
    
    print(f"Diff has been generated and saved to {output_path}")

if __name__ == "__main__":
    main() 