<script lang="ts">
  import Section from '$lib/components/Section.svelte';
  import Card from '$lib/components/Card.svelte';
  import TextBlock from '$lib/components/TextBlock.svelte';
  import ImageBlock from '$lib/components/ImageBlock.svelte';
  import Button from '$lib/components/Button.svelte';
  import Grid from '$lib/components/Grid.svelte';
  import Heading from '$lib/components/Heading.svelte';
  import Spacer from '$lib/components/Spacer.svelte';
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
        <ImageBlock src="/logo.png" alt="Allison Token - Team Member" />
        <TextBlock title="Allison Token" lead="Owner • Co-founder">
          <p>Allison's bio here.</p>
          <div class="pt-2">
            <Button variant="link" href="#">LinkedIn</Button>
          </div>
        </TextBlock>
      </div>
    </Card>

    <Card>
      <div class="space-y-4">
        <ImageBlock src="/logo.png" alt="Team member" />
        <TextBlock title="Nicholas Neidlinger" lead="Painter • Co-founder">
          <p>Nick's bio here.</p>
          <div class="pt-2">
            <Button variant="link" href="#">LinkedIn</Button>
          </div>
        </TextBlock>
      </div>
    </Card>
  </Grid>
</Section>
