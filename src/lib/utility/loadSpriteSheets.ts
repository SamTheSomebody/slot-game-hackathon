import { Assets, type Spritesheet } from 'pixi.js';

export async function loadSpriteSheets(name: string, path: string): Promise<Spritesheet[]> {
	const sheets: Spritesheet[] = [];
	let url = `${path}/${name}.json`;

	try {
		const sheet = (await Assets.load(url)) as Spritesheet;
		sheets.push(sheet);
	} catch (err) {
		console.log(
			'There may be multiple sprite sheets! Attempting to find files with numbered extension.\n' +
				err
		);
		let i = 0;
		while (true) {
			url = `${path}/${name}-${i}.json`;
			try {
				const s = (await Assets.load(url)) as Spritesheet;
				sheets.push(s);
				i++;
			} catch (err) {
				if (i === 0) {
					console.error(
						'No spritesheets found! You might have an incorrect path or file name. \n' + err
					);
				}
				console.log(`Found ${i} spritesheets for ${name}.\n${err}`);
				break;
			}
		}
	}
	return sheets;
}
