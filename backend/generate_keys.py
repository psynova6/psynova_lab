import secrets
import base64

def generate_keys():
    secret_key = secrets.token_hex(32)
    encryption_key = base64.b64encode(secrets.token_bytes(32)).decode()
    print(f"SECRET_KEY={secret_key}")
    print(f"ENCRYPTION_MASTER_KEY={encryption_key}")

if __name__ == "__main__":
    generate_keys()
