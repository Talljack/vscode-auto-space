import { z } from 'zod'

const AutoSpaceConfig = z.object({
  formatOnSave: z.boolean(),
  formatOnDocument: z.boolean(),
  spaceType: z.enum(['all', 'comment']),
  excludedExtensions: z.array(z.string()).default([]),
})

export type AutoSpaceConfigType = z.infer<typeof AutoSpaceConfig>
