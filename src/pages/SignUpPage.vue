<template>
    <h1>Sign Up</h1>
    <label for="username">Username</label>
    <input
        id="username"
        placeholder="username"
        autocomplete="username"
    />
    
    <label for="email">E-mail</label>
    <input
        id="email"
        placeholder="e-mail"
        autocomplete="email"
    />

    <label for="password">Password</label>
    <input
        id="password"
        type="password"
        autocomplete="new-password"
        v-model="password"
    />
 
    <label for="repeat_password">Repeat Password</label>
    <input
        id="repeat_password"
        type="password"
        autocomplete="current-password"
        v-model="repeatedPassword"
    />

    <button :disabled="isDisabled">Sign Up</button>
</template>

<script>
export default {
    name: "SignUpPage",
    data() {
        return {
            password: "",
            repeatedPassword: ""
        }
    },
    computed: {
        isDisabled() {
            return (this.password && this.repeatedPassword) ? this.password !== this.repeatedPassword : true;
        }
    }
}
</script>