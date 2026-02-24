import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# Generate a fresh key for each test run
TEST_KEY = AESGCM.generate_key(bit_length=256)
aesgcm = AESGCM(TEST_KEY)

def test_encryption():
    data = "Sensitive Health Data"
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, data.encode(), None)
    
    # Decrypt
    decrypted = aesgcm.decrypt(nonce, ciphertext, None)
    print(f"Original: {data}")
    print(f"Decrypted: {decrypted.decode()}")
    
    assert data == decrypted.decode()
    print("Encryption test passed!")

if __name__ == "__main__":
    test_encryption()
