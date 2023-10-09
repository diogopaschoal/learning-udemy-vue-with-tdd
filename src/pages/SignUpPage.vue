<template>
<form>
    <h1>Sign Up</h1>
    <label for="username">Username</label>
    <input
        id="username"
        placeholder="username"
        autocomplete="username"
        v-model="username"
    />
    
    <label for="email">E-mail</label>
    <input
        id="email"
        placeholder="e-mail"
        autocomplete="email"
        v-model="email"
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

    <button :disabled="isDisabled" @click.prevent="submit">Sign Up</button>
</form>
</template>

<script>
import axios from "axios";

export default {
    name: "SignUpPage",
    data() {
        return {
            username: "",
            email: "",
            password: "",
            repeatedPassword: ""
        }
    },
    computed: {
        isDisabled() {
            return (this.password && this.repeatedPassword) ? this.password !== this.repeatedPassword : true;
        }
    },
    methods: {
        submit(event) {
            axios.post(
                "/api/1.0/users",
                {
                    username: this.username,
                    email: this.email,
                    password: this.password
                }
            );
        }
    }
}
</script>