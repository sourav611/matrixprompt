export function validateTagName(name: string): string | null {
  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return "Tag name cannot be empty";
  }
  
  if (trimmed.length > 30) {
    return "Tag name must be 30 characters or less";
  }
  
  const regex = /^[a-zA-Z0-9\s-]+$/;
  if (!regex.test(trimmed)) {
    return "Tag name can only contain letters, numbers, spaces, and hyphens";
  }
  
  return null;
}
