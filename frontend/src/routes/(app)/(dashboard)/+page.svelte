<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
</script>

<Sidebar.Trigger class="-ms-1" />
<Separator
  orientation="vertical"
  class="me-2 data-[orientation=vertical]:h-4"
/>
<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item class="hidden md:block">
      <Breadcrumb.Link href="##">Build Your Application</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator class="hidden md:block" />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
