<script lang="ts">
  import Section from '$lib/components/Section.svelte';
  import Card from '$lib/components/Card.svelte';
  import TextBlock from '$lib/components/TextBlock.svelte';
  import ImageBlock from '$lib/components/ImageBlock.svelte';
  import Button from '$lib/components/Button.svelte';
  import Grid from '$lib/components/Grid.svelte';
  import Heading from '$lib/components/Heading.svelte';
  import Spacer from '$lib/components/Spacer.svelte';
  import Prose from '$lib/components/Prose.svelte';
  
  import allisonHeadshot from '$lib/assets/meet-the-team/allison-headshot.jpg';
  import nickHeadshot from '$lib/assets/meet-the-team/nick-headshot.jpg';
  import nickAllisonDinner from '$lib/assets/meet-the-team/nick-allison-dinner.png';
  import nickAllisonNature from '$lib/assets/meet-the-team/nick-allison-nature.png';
  import nickWithFlag from '$lib/assets/meet-the-team/nick-with-flag.jpg';
</script>

<svelte:head>
  <title>Meet the Team | Semper Finish</title>
  <meta name="description" content="Meet the Semper Finish team — craftspeople dedicated to quality work for homes and businesses." />

  <!-- Open Graph -->
  <meta property="og:title" content="Meet the Team | Semper Finish" />
  <meta property="og:description" content="Meet the Semper Finish team — craftspeople dedicated to quality work for homes and businesses." />

  <!-- Twitter -->
  <meta name="twitter:title" content="Meet the Team | Semper Finish" />
  <meta name="twitter:description" content="Meet the Semper Finish team — craftspeople dedicated to quality work for homes and businesses." />
</svelte:head>

<Section width="wide">
  <Heading title="Meet the Team" lead="A power combo focused on solving problems for you and your family." />

  <Spacer />

  <Grid class="sm:grid-cols-2 lg:grid-cols-3">
    <Card>
      <div class="space-y-4">
        <ImageBlock src={allisonHeadshot} alt="Allison Token - Owner & Co-founder" />
        <TextBlock title="Allison Token" lead="Owner • Co-founder">
          <Button variant="link" href="https://www.linkedin.com/in/allison-token-2426b324b/">LinkedIn</Button>
        </TextBlock>
      </div>
    </Card>

    <Card>
      <div class="space-y-4">
        <ImageBlock src={nickHeadshot} alt="Nick Neidlinger - Vetern & Painter" />
        <TextBlock title="Nicholas Neidlinger" lead="Veteran • Painter"></TextBlock>
      </div>
    </Card>
  </Grid>
  
  <div class="prose prose-neutral dark:prose-invert max-w-none prose-h2:mb-1 prose-p:mt-0 mt-6 mb-6">
    <h2>About Us</h2>
  </div>
  
  <Prose class="mt-4">
    <p>Semper Finish is a woman-owned, veteran-operated, Missouri-based LLC providing residential and small commercial painting services. Owner Allison Token founded Semper Finish, having been inspired by her fiance, Nick - a veteran who served 8 years in the U.S. Marine Corps.</p>
  
    <p>After specializing in avionics during active duty, Nick transitioned to a civilian career of painting and remodeling because of his ability to see the big picture, while maintaining a keen eye for detail in every small step along the way. Or, as Allison likes to put it, “he sees the forest and the trees.”</p>
  
    <p>Understanding the struggles veterans face when it comes to transitioning back to civilian life is what inspired Allison to want to be of service to those who so courageously served us. She started Semper Finish with the aim to hire veterans in the trade,  providing stable work for them, while they deliver results backed by military grade standards to our customers. High-quality work, by reliable people, with heart and precision you can trust.</p>
  </Prose>
  
  <div class="prose prose-neutral dark:prose-invert max-w-none prose-h2:mb-1 prose-p:mt-0 mt-6 mb-6">
    <h2>Allison and Nick</h2>
  </div>
  
  <Grid class="sm:grid-cols-3 lg:grid-cols-3">
    <div class="space-y-4">
      <ImageBlock src={nickAllisonDinner} alt="Nick & Allison posing for a photo at dinner" />
    </div>
    <div class="space-y-4">
      <ImageBlock src={nickAllisonNature} alt="Nick & Allison posing for a photo in nature" />
    </div>
    <div class="space-y-4">
      <ImageBlock src={nickWithFlag} alt="Nick walking with the American Flag" />
    </div>
  </Grid>
</Section>
