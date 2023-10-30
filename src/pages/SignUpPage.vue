<template>
    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        <form class="card mt-5">
            <div class="card-header">
                <h1 class="text-center">Sign Up</h1>
            </div>

            <div class="card-body">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input id="username" placeholder="username" autocomplete="username" class="form-control" v-model="username" />
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">E-mail</label>
                    <input id="email" placeholder="e-mail" autocomplete="email" class="form-control" v-model="email" />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input id="password" type="password" autocomplete="new-password" class="form-control" v-model="password" />
                </div>
                <div class="mb-3">
                    <label for="repeat_password" class="form-label">Repeat Password</label>
                    <input id="repeat_password" type="password" autocomplete="current-password" class="form-control" v-model="repeatedPassword" />
                </div>
                <div class="text-center">
                    <button class="btn btn-primary" :disabled="isDisabled" @click.prevent="submit">Sign Up</button>
                </div>
            </div>
        </form>
    </div>
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
        submit() {
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
