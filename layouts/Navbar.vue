<template>
  <b-navbar class="shadow" fixed="top" type="dark" variant="primary">
    <nuxt-link class="navbar-brand" to="/admin">
      <b-img class="d-inline align-top" fluid width="30" src="/icon.png" />
      {{ appName }}
    </nuxt-link>

    <b-navbar-toggle target="app-nav" />

    <b-collapse id="app-nav" is-nav>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <nuxt-link class="nav-link" to="/admin/my-profile">{{ $auth.user.name }}</nuxt-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" v-b-toggle:app-sidebar @click.prevent>
            <fa icon="bars" />
            <span>&nbsp;Menu</span>
          </a>
        </li>
      </ul>
    </b-collapse>
  </b-navbar>
</template>
