import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

/**
 * antd Select is not a native <select>. Open it by its accessible name, then click the option.
 * Options render in a portal and carry their label as the `title` attribute.
 */
export async function selectAntdOption(
  user: UserEvent,
  comboboxName: string,
  optionLabel: string,
): Promise<void> {
  await user.click(screen.getByRole('combobox', { name: comboboxName }))
  await user.click(await screen.findByTitle(optionLabel))
}
