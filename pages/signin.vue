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
        <nuxt-link :to="'/signup'" class="text-blue-500">Noch kein Nutzerkonto? Registrieren</nuxt-link>
      </div>

      <!-- Sign-In Form -->
      <form @submit.prevent="handleSignIn" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="emailAddress" class="sr-only">Email</label>
            <input v-model="signin.emailAddress" id="emailAddress" name="emailAddress" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address">
          </div>
          <div class="mt-4">
            <label for="password" class="sr-only">Password</label>
            <input v-model="signin.password" id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password">
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember_me" name="remember_me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
            <label for="remember_me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
        </div>

        <div>
          <button type="submit" class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Anmelden
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

// Reactive objects for form data
const signin = ref({
  emailAddress: '',
  password: ''
})

// Handle sign-in submission
const handleSignIn = async () => {
  const url = 'https://api.uranus.oklabflensburg.de/user/signin';

  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', emailAddress.value);
  formData.append('password', password.value);
  formData.append('scope', ''); // Adjust if necessary
  formData.append('client_id', 'string'); // Replace with actual client ID
  formData.append('client_secret', 'string'); // Replace with actual client secret

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);

      // Assuming the successful response contains an access token
      const token = data.access_token;

      // Optionally, store the token in localStorage/sessionStorage or Vuex (for state management)
      localStorage.setItem('access_token', token);

      // Redirect to the dashboard or home page after successful sign-in
      router.push('/dashboard'); // Adjust the route to where you want to redirect
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      // Handle the error (e.g., show error message)
    }
  } catch (error) {
    console.error('Request failed:', error);
    // Handle network errors
  }
};
</script>  