/**
 * Enum representing different rendering modes.
 *
 * The `RenderingMode` enum has two possible values:
 * - `Build`: Used for build-time rendering, where the content is generated and saved for later use.
 * - `Render`: Used for real-time rendering, where the content is generated in response to user interactions or other real-time events.
 */
export enum RenderingMode {
	Build = 'build',
	Render = 'render'
}
