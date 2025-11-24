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

  <!-- Open Graph -->
  <meta property="og:title" content="Customer Testimony | Semper Finish" />
  <meta property="og:description" content="Read real reviews and testimonials from Semper Finish customers about our services." />

  <!-- Twitter -->
  <meta name="twitter:title" content="Customer Testimony | Semper Finish" />
  <meta name="twitter:description" content="Read real reviews and testimonials from Semper Finish customers about our services." />
</svelte:head>

<Section>
  <Heading title="Customer Testimony" lead="A few words from folks we've worked with." />
  <Spacer />

  <Grid class="sm:grid-cols-2 items-start">
    <Card elevated>
      <Prose>
        <blockquote>
          <p>
            It’s incredible what a difference a fresh coat of paint can make — and Semper Finish nailed it! Nick was great and showed up when he said he would and completed the project in a timely manner. You can tell he put real effort into the prep and finishing details. The end result looks even better than I imagined. The price was very fair and will be calling again for any future projects. Thank you so much!
          </p>
        </blockquote>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">— Patsy H.</p>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">Project: Drywall and taping repairs on damaged walls. Re-painting 6 areas.</p>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">Date: November 2025</p>
      </Prose>
    </Card>
    
    <Card elevated>
      <Prose>
        <blockquote>
          <p>
            Your home will be in good hands with Semper Finish; I highly recommend them to anyone looking for reliable, high-quality painting and/or renovation work — they made the whole process easy and stress-free. Nick was great, letting me know exactly how it would be done and why, which is always assuring for a type A personality like myself. Thank you, Semper Finish!
          </p>
        </blockquote>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">— Louise A.</p>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">Project: Repair and repaint stairwell.</p>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">Date: October 2025</p>
      </Prose>
    </Card>

    <Card elevated>
      <Prose>
        <blockquote>
          <p>
            Nick's attention to detail was amazing! Next time I need a painter, I know who to call.
          </p>
        </blockquote>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">— Carole T.</p>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">Project: Refinished/repainted interior garage.</p>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">Date: September 2025</p>
      </Prose>
    </Card>
  </Grid>
</Section>
