<template>
    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        <form class="card mt-5" data-testid="form-sign-up" v-if="!signUpSuccess">
            <div class="card-header">
                <h1 class="text-center">{{ $t("signUp") }}</h1>
            </div>

            <div class="card-body">
                <TextInput id="username"
                    :label="$t('username')"
                    :help="errors.username"
                    v-model="username"/>
                <TextInput id="email"
                    :label="$t('email')"
                    :help="errors.email"
                    v-model="email"/>
                <TextInput id="password"
                    :label="$t('password')"
                    :help="errors.password"
                    v-model="password"
                    type="password"/>
                <TextInput id="repeat_password"
                    :label="$t('repeatPassword')"
                    :help="hasPasswordMismatch ? 'Password mismatch': ''"
                    v-model="repeatedPassword"
                    type="password"/>
                <div class="text-center">
                    <button class="btn btn-primary"
                        :disabled="isDisabled || apiProgress"
                        @click.prevent="submit">
                            <span v-if="apiProgress"
                                class="spinner-border spinner-border-sm"
                                role="status">
                            </span>
                            {{$t('signUp')}}
                    </button>
                </div>
            </div>
        </form>
        <div class="alert alert-success mt-3" v-else>Please, check your e-mail to activate your account.</div>
    </div>
</template>

<script>
import axios from "axios";
import TextInput from "../components/TextInput.vue";

export default {
    name: "SignUpPage",
    components: {
        TextInput
    },
    data() {
        return {
            disabled: false,
            apiProgress: false,
            signUpSuccess: false,
            username: "",
            email: "",
            password: "",
            repeatedPassword: "",
            errors: {}
        };
    },
    computed: {
        isDisabled() {
            return (this.password && this.repeatedPassword) ? this.password !== this.repeatedPassword : true;
        },

        hasPasswordMismatch() {
            return this.password !== this.repeatedPassword;
        }
    },
    methods: {
        submit() {
            this.apiProgress = true;
            axios.post(
                "/api/1.0/users",
                {
                    username: this.username,
                    email: this.email,
                    password: this.password
                }
            ).then(() => {
                this.signUpSuccess = true;
            }).catch((error) => {
                if (error.response.status === 400 && error.response.data.validationErrors ) {
                    this.errors = error.response.data.validationErrors;
                }
                this.apiProgress = false;
            });
        },
    },
    watch: {
        username() {
            delete this.errors.username;
        },
        email() {
            delete this.errors.email;
        },
        password() {
            delete this.errors.password;
        }
    },
}
</script>
