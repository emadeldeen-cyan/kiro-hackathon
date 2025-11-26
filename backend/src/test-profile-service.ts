import { ProfileService } from './services';
import { InMemoryProfileRepository } from './repositories';

async function testProfileService() {
  const profileRepository = new InMemoryProfileRepository();
  const profileService = new ProfileService(profileRepository);

  console.log('Testing ProfileService...\n');

  try {
    // Test 1: Create a profile
    console.log('Test 1: Create a profile');
    const profile1 = await profileService.createProfile(
      'user_1',
      'John Doe',
      'Software developer',
      'https://example.com/avatar.jpg'
    );
    console.log('✓ Profile created:', profile1);

    // Test 2: Get the profile
    console.log('\nTest 2: Get the profile');
    const retrievedProfile = await profileService.getProfile('user_1');
    console.log('✓ Profile retrieved:', retrievedProfile);

    // Test 3: Update the profile
    console.log('\nTest 3: Update the profile');
    const updatedProfile = await profileService.updateProfile('user_1', {
      displayName: 'Jane Doe',
      bio: 'Senior software developer',
    });
    console.log('✓ Profile updated:', updatedProfile);

    // Test 4: Verify display name validation (should fail)
    console.log('\nTest 4: Test display name validation (should fail)');
    try {
      await profileService.createProfile(
        'user_2',
        'A'.repeat(101), // 101 characters
        'Test bio'
      );
      console.log('✗ Should have failed validation');
    } catch (error) {
      console.log('✓ Validation error caught:', (error as Error).message);
    }

    // Test 5: Try to create duplicate profile (should fail)
    console.log('\nTest 5: Try to create duplicate profile (should fail)');
    try {
      await profileService.createProfile('user_1', 'Duplicate', 'Test');
      console.log('✗ Should have failed duplicate check');
    } catch (error) {
      console.log('✓ Duplicate error caught:', (error as Error).message);
    }

    // Test 6: Try to get non-existent profile (should fail)
    console.log('\nTest 6: Try to get non-existent profile (should fail)');
    try {
      await profileService.getProfile('user_999');
      console.log('✗ Should have failed to find profile');
    } catch (error) {
      console.log('✓ Not found error caught:', (error as Error).message);
    }

    // Test 7: Try to update non-existent profile (should fail)
    console.log('\nTest 7: Try to update non-existent profile (should fail)');
    try {
      await profileService.updateProfile('user_999', { displayName: 'Test' });
      console.log('✗ Should have failed to find profile');
    } catch (error) {
      console.log('✓ Not found error caught:', (error as Error).message);
    }

    // Test 8: Update with invalid display name (should fail)
    console.log('\nTest 8: Update with invalid display name (should fail)');
    try {
      await profileService.updateProfile('user_1', {
        displayName: 'B'.repeat(101),
      });
      console.log('✗ Should have failed validation');
    } catch (error) {
      console.log('✓ Validation error caught:', (error as Error).message);
    }

    console.log('\n✓ All ProfileService tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error);
    process.exit(1);
  }
}

testProfileService();
