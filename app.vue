<template>
  <nuxt-page/>
</template>


<style scoped>
:root {
  --primary-color: #0b78d2;
  --secondary-color: #489fe7;
  --background-color: #217ec2;
  --bg-color: #eeeeee;
  --text-color: #ffffff;
  --text-hover: #b5b9bf;

  --transition: all 0.3s ease-in-out;
  --spacing-unit: 1rem;
  --primary-border-radius: 15px;

  --text-size-h1: clamp(3rem, 5vw, 4rem);
  --text-size-h2: clamp(2.5rem, 4vw, 3.5rem);
  --text-size-h3: clamp(2rem, 3.5vw, 3rem);
  --text-size-h4: clamp(1.75rem, 3vw, 2.5rem);
  --text-size-h5: clamp(1.5rem, 2.5vw, 2rem);
  --text-size-h6: clamp(1rem, 2vw, 1.5rem);

  --text-size-body: 1rem;
  --text-size-small: 0.875rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  button {
    border: none;
    outline: none;
    cursor: pointer;
  }
}

</style>