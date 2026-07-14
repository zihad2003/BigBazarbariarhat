import bcrypt from 'bcryptjs';

async function main() {
  const password = 'admin123';
  const hash = '$2b$12$1pJ2mLE3i1DERXVhcser5Ot1zMIxlmYVZRsR5FcbI52TqViyBNEqW';
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password test:', isValid ? '✅ Valid' : '❌ Invalid');
  
  // Test with a new hash
  const newHash = await bcrypt.hash(password, 12);
  console.log('New hash:', newHash);
  const isNewValid = await bcrypt.compare(password, newHash);
  console.log('New hash test:', isNewValid ? '✅ Valid' : '❌ Invalid');
}

main();
