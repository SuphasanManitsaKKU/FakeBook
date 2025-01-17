import hashlib
import base64

def text_to_base64_256bit(text):
    # Hash the input text to generate a 256-bit key
    sha256_hash = hashlib.sha256(text.encode('utf-8')).digest()
    # Encode the hash in Base64
    base64_key = base64.b64encode(sha256_hash).decode('utf-8')
    return base64_key

# Example usage
input_text = "12345"
base64_256bit_key = text_to_base64_256bit(input_text)
print("Base64-encoded 256-bit key:", base64_256bit_key)
