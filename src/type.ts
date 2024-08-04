import { z } from 'zod'

const AutoSpaceConfig = z.object({
  formatOnSave: z.boolean(),
  formatOnDocument: z.boolean(),
  spaceType: z.enum(['all', 'comment']),
})

export type AutoSpaceConfigType = z.infer<typeof AutoSpaceConfig>
