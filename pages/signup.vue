<template>
  <div class="max-w-screen-sm mx-auto bg-white p-3 md:p-6 rounded-xs shadow-lg">
    <div class="w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Uranus Admin Panel
        </h2>
      </div>

      <!-- Toggle between sign-up and sign-in -->
      <div class="text-center space-x-4">
        <nuxt-link :to="'/signin'" class="text-blue-500">Jetzt Anmelden</nuxt-link>
      </div>

      <!-- Sign-Up Form -->
      <form @submit.prevent="handleSignUp" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="first_name" class="sr-only">First Name</label>
            <input v-model="signup.first_name" id="first_name" name="first_name" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="First Name">
          </div>
          <div>
            <label for="last_name" class="sr-only">Last Name</label>
            <input v-model="signup.last_name" id="last_name" name="last_name" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Last Name">
          </div>
          <div>
            <label for="email" class="sr-only">Email</label>
            <input v-model="signup.email_address" id="email" name="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address">
          </div>
          <div>
            <label for="username" class="sr-only">Username</label>
            <input v-model="signup.username" id="username" name="username" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Username">
          </div>
          <div class="mt-4">
            <label for="password" class="sr-only">Password</label>
            <input v-model="signup.password" id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password">
          </div>
          <div class="mt-4">
            <label for="confirm_password" class="sr-only">Confirm Password</label>
            <input v-model="signup.confirmPassword" id="confirm_password" name="confirm_password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Confirm Password">
          </div>
        </div>

        <div>
          <button type="submit" class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Registrieren
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

const signup = ref({
  first_name: '',
  last_name: '',
  email_address: '',
  username: '',
  password: '',
  confirmPassword: ''
})

// Handle sign-up submission
const handleSignUp = async () => {
  // Make sure the passwords match
  if (signup.value.password !== signup.value.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  const url = 'https://api.uranus.oklabflensburg.de/user/signup';

  const requestBody = {
    first_name: signup.value.first_name,
    last_name: signup.value.last_name,
    email_address: signup.value.email_address,
    username: signup.value.username,
    password: signup.value.password,
    disabled: false, // Set based on your needs
    i18n_locale_id: 0 // Adjust if needed
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Sign-up successful:', data);
      // Redirect or show success message
      alert('Account created successfully!');
      // Optionally, navigate to login page or other page
      router.push('/signin');
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      alert('Error: ' + errorData.detail || 'Sign-up failed');
    }
  } catch (error) {
    console.error('Request failed:', error);
    alert('Network error, please try again.');
  }
};
</script>  