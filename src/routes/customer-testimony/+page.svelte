<script lang="ts">
  import Section from '$lib/components/Section.svelte';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Grid from '$lib/components/Grid.svelte';
  import Heading from '$lib/components/Heading.svelte';
  import Spacer from '$lib/components/Spacer.svelte';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Customer Testimony | Semper Finish</title>
  <meta name="description" content="Read real reviews and testimonials from Semper Finish customers about our services." />
</svelte:head>

<Section>
  <Heading title="Customer Testimony" lead="A few words from folks we've worked with." />
  <Spacer />

  <Grid class="sm:grid-cols-2">
    <Card elevated>
      <Prose>
        <blockquote>
          <p>
            Semper Finish exceeded our expectations. The attention to detail and professionalism were outstanding.
          </p>
        </blockquote>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">— Jordan M.</p>
      </Prose>
    </Card>

    <Card elevated>
      <Prose>
        <blockquote>
          <p>
            On time, on budget, and a flawless finish. We’ll be calling them again for our next project.
          </p>
        </blockquote>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">— Riley S.</p>
      </Prose>
    </Card>

    <Card elevated>
      <Prose>
        <blockquote>
          <p>
            They made great recommendations, kept the site clean, and the results look fantastic in any light.
          </p>
        </blockquote>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">— Casey A.</p>
      </Prose>
    </Card>

    <Card elevated>
      <div class="flex items-center justify-between gap-4">
        <Prose>
          <blockquote>
            <p>
              Clear communication from start to finish. Couldn’t be happier with the quality.
            </p>
          </blockquote>
          <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">— Morgan T.</p>
        </Prose>
      </div>
    </Card>
  </Grid>
</Section>
