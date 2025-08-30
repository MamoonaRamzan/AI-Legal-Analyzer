import os

# Define project structure
project_structure = {
        "backend": {
            "routes": {
                "__init__.py": "",
                "upload_routes.py": "",
                "query_routes.py": "",
            },
            "services": {
                "__init__.py": "",
                "parser.py": "",
                "rag.py": "",
                "risk_analysis.py": "",
            },
            "reports": {
                "__init__.py": "",
                "report_generator.py": "",
            },
            "app.py": "",
        },
        "frontend": {},  # later we can add React or simple HTML
        "infra": {
            "docker-compose.yml": "",
        },
        "tests": {
            "__init__.py": "",
            "test_app.py": "",
        },
        "README.md": "",
        "requirements.txt": "",
    }



def create_structure(base_path, structure):
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        else:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)


if __name__ == "__main__":
    base_dir = "."
    create_structure(base_dir, project_structure)
    print("✅ Project structure created successfully!")
