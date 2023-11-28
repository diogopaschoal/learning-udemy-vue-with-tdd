<template>
    <img class="i18nLanguageSelector"
        src="https://flagsapi.com/BR/flat/24.png"
        title="Portuguese"
        alt="Mudar língua para português do Brasil"
        @click="$i18n.locale = 'pt-BR'">
    <img class="i18nLanguageSelector"
        src="https://flagsapi.com/US/flat/24.png"
        title="English"
        alt="Change language to United States english"
        @click="$i18n.locale = 'en'">
</template>

<style scoped>
    .i18nLanguageSelector {
        cursor: pointer;
    }
</style>