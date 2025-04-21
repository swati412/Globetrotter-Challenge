import sys
print("Python version:", sys.version)

try:
    from simple_app import app
    print("Successfully imported app from simple_app.py")
    print(type(app))
except Exception as e:
    print(f"Error importing app: {e}")
    import traceback
    traceback.print_exc() 