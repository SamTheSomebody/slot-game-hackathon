import { Assets, type Spritesheet } from 'pixi.js';

export async function loadSpriteSheets(name: string, path: string): Promise<Spritesheet[]> {
	const sheets: Spritesheet[] = [];
	let url = `${path}/${name}.json`;

	try {
		const sheet = (await Assets.load(url)) as Spritesheet;
		sheets.push(sheet);
	} catch (err) {
		console.log(
			"Couldn't find a singluar sprite sheet for: " + err + '\nAttempting to find multiple...'
		);
		let i = 0;
		while (true) {
			url = `${path}/${name}-${i}.json`;
			try {
				const s = (await Assets.load(url)) as Spritesheet;
				sheets.push(s);
				i++;
			} catch (err) {
				console.log("Couldn't find anymore sprite sheets for: " + err);
				break;
			}
		}
	}
	return sheets;
}
