import os
import json
import difflib
import argparse
from pathlib import Path
from typing import Dict, List, Set, Tuple
import subprocess

class FeatureExtractor:
    def __init__(self, original_path: str, modified_path: str):
        self.original_path = Path(original_path)
        self.modified_path = Path(modified_path)
        self.ignore_patterns = {
            '.git', 'node_modules', '__pycache__', 
            '.DS_Store', '*.pyc', '*.map'
        }
        # Define feature patterns to look for
        self.feature_patterns = {
            'sandpack': {
                'files': ['Sandpack.tsx', 'Sandpack.scss'],
                'dependencies': ['@codesandbox/sandpack-react', '@codesandbox/sandpack-themes'],
                'imports': ['SandpackProvider', 'SandpackLayout', 'SandpackPreview']
            },
            'analytics': {
                'files': [],
                'dependencies': ['@vercel/analytics'],
                'imports': ['Analytics']
            }
        }

    def extract_new_dependencies(self) -> Dict[str, str]:
        """Extract new dependencies and their versions."""
        try:
            with open(self.original_path / 'package.json') as f1:
                original_pkg = json.load(f1)
            with open(self.modified_path / 'package.json') as f2:
                modified_pkg = json.load(f2)

            original_deps = set(original_pkg.get('dependencies', {}).keys())
            modified_deps = modified_pkg.get('dependencies', {})
            
            new_deps = {
                dep: modified_deps[dep] 
                for dep in modified_deps.keys() 
                if dep not in original_deps
            }
            
            return new_deps
        except FileNotFoundError:
            return {}

    def get_feature_files(self, feature_name: str) -> List[Dict[str, str]]:
        """Get all files related to a specific feature."""
        feature_files = []
        pattern = self.feature_patterns[feature_name]
        
        for file_pattern in pattern['files']:
            for file_path in self.modified_path.rglob(file_pattern):
                with open(file_path) as f:
                    content = f.read()
                    feature_files.append({
                        'path': str(file_path.relative_to(self.modified_path)),
                        'content': content
                    })
        
        return feature_files

    def generate_integration_guide(self) -> str:
        """Generate integration guide for new features."""
        new_deps = self.extract_new_dependencies()
        
        md_content = [
            "# Feature Integration Guide\n",
            "This guide details how to integrate new features from the modified version into the original project.\n"
        ]

        # Analyze Sandpack Integration
        if any(dep.startswith('@codesandbox/sandpack') for dep in new_deps):
            md_content.extend([
                "\n## 1. Live Code Preview Feature\n",
                "### Dependencies to Add\n```json",
                json.dumps(
                    {dep: ver for dep, ver in new_deps.items() 
                     if dep.startswith('@codesandbox/sandpack')},
                    indent=2
                ),
                "```\n",
                "### Integration Steps\n",
                "1. Add the Sandpack component:\n",
                "   - Create `src/components/Sandpack.tsx`\n",
                "   - Create `src/components/Sandpack.scss`\n",
                "   - Copy the component files from the modified version\n",
                "\n2. Update your main component:\n```typescript",
                "import Sandpack from '../components/Sandpack';\n",
                "// Add to your component render method:",
                "<Sandpack files={generatedFiles} />\n",
                "```\n",
                "\n3. Add dark theme configuration:\n```typescript",
                "import { sandpackDark } from '@codesandbox/sandpack-themes';\n",
                "```\n"
            ])

        # Analyze Analytics Integration
        if '@vercel/analytics' in new_deps:
            md_content.extend([
                "\n## 2. Analytics Feature\n",
                "### Dependencies to Add\n```json",
                json.dumps(
                    {'@vercel/analytics': new_deps['@vercel/analytics']},
                    indent=2
                ),
                "```\n",
                "### Integration Steps\n",
                "1. Update App.tsx:\n```typescript",
                "import { Analytics } from '@vercel/analytics/react';\n",
                "\nfunction App() {\n  return (\n    <div data-component='App'>\n      <Analytics />\n      <ConsolePage />\n    </div>\n  );\n}\n",
                "```\n"
            ])

        # Add implementation details
        md_content.extend([
            "\n## Implementation Details\n",
            "### State Management\n",
            "The modified version manages code generation state using:\n",
            "```typescript",
            "const [generatedFiles, setGeneratedFiles] = useState({});\n",
            "```\n",
            "\n### Event Handling\n",
            "Voice input processing is integrated with code generation:\n",
            "```typescript",
            "const handleVoiceInput = (text: string) => {\n",
            "  // Process voice input and generate code\n",
            "  setGeneratedFiles(previousFiles => ({\n",
            "    ...previousFiles,\n",
            "    // Add new generated code\n",
            "  }));\n",
            "};\n",
            "```\n"
        ])

        return "\n".join(md_content)

def main():
    parser = argparse.ArgumentParser(description='Generate feature integration guide between two repositories')
    parser.add_argument('--original', required=True, help='Path to the original repository')
    parser.add_argument('--modified', required=True, help='Path to the modified repository')
    parser.add_argument('--output', required=True, help='Output path for the integration guide')
    
    args = parser.parse_args()
    
    extractor = FeatureExtractor(args.original, args.modified)
    guide_content = extractor.generate_integration_guide()
    
    # Write the integration guide to the specified output file
    with open(args.output, "w") as f:
        f.write(guide_content)
    
    print(f"Integration guide has been generated and saved to {args.output}")

if __name__ == "__main__":
    main()
