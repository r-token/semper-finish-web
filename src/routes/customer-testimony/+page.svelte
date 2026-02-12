<script lang="ts">
  import Section from '$lib/components/Section.svelte';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Grid from '$lib/components/Grid.svelte';
  import Heading from '$lib/components/Heading.svelte';
  import Spacer from '$lib/components/Spacer.svelte';
  import Prose from '$lib/components/Prose.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import TestimonialForm from '$lib/components/TestimonialForm.svelte';
  import CTAButton from '$lib/components/CTAButton.svelte';

  let { data, form } = $props();
  let testimonialModalOpen = $state(false);
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
  
  <div class="mt-4 flex justify-start">
    <CTAButton onclick={() => testimonialModalOpen = true}>
      Submit Testimonial
    </CTAButton>
  </div>
  
  <Spacer />

  <Grid class="sm:grid-cols-2 items-start">
    <Card elevated>
      <Prose>
        <blockquote>
          <p>
            Our Chesterfield Townhome had a major renovation roughly five years ago. There was a rush to finish at the time and so the last thing - the crown molding and painting - got less attention than probably needed. We had streaks, drips, gaps, etc. Some of these were in a large wrap around staircase that created heights of well over 20 feet above declining stairs - so not easily accessible. We hired Semper Finish to complete the job in a defined period of time while we were out of town. They touched every wall, fixed nail pops, sealed cracks, nailed crown molding and filled, and repainted the entire house. They had to cut samples to take to the paint store as we no longer had the paint in order to match colors. The house looks amazing and we could tell the care they took in prep as our home and all floors and furniture was clean let alone no drips anywhere. I can’t recommend Semper Finish enough for the care and professionalism they will bring to your project. 
          </p>
        </blockquote>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">— Eric T.</p>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">Project: Whole-home repaint and other improvements.</p>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">Date: February 2026</p>
      </Prose>
    </Card>
    
    <Card elevated>
      <Prose>
        <blockquote>
          <p>
            It’s incredible what a difference a fresh coat of paint can make — and Semper Finish nailed it! Nick was great and showed up when he said he would and completed the project in a timely manner. You can tell he put real effort into the prep and finishing details. The end result looks even better than I imagined. The price was very fair and will be calling again for any future projects. Thank you so much!
          </p>
        </blockquote>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">— Patsy H.</p>
        <p class="m-0 text-sm text-neutral-600 dark:text-neutral-400">Project: Drywall and taping repairs on damaged walls. Repainting 6 areas.</p>
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

<Modal bind:open={testimonialModalOpen}>
  <TestimonialForm {form} csrfToken={data?.csrfToken} onClose={() => testimonialModalOpen = false} />
</Modal>
