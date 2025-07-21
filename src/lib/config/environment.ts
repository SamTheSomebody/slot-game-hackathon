import { DISPLAY } from './display';

export type ImageLoaderData = {
	url: string;
	x?: number;
	y?: number;
	z?: number;
	width?: number;
	height?: number;
};

export const CLOUD_URL = 'assets/environment/cloud.png';
export const LEAF_URL = 'assets/environment/trees/leaf.png';

export const BACKGROUND_IMAGES: ImageLoaderData[] = [
	{
		url: '/assets/environment/background/sky.png'
	},
	{
		url: '/assets/environment/background/mountains.png'
	},
	{
		url: '/assets/environment/background/hill_background.png',
		y: 300
	},
	{
		url: '/assets/environment/background/hill_midground.png',
		y: 500
	}
];

export const FOREGROUND_IMAGES: ImageLoaderData[] = [
	{
		url: '/assets/environment/ground.png',
		x: -180,
		y: 580,
		width: DISPLAY.width + 200,
		height: 283
	},
	{ url: '/assets/environment/trees/header.png', x: 0, y: 0, width: DISPLAY.width, height: 150 },
	{
		url: '/assets/environment/foliage/foliage_1A.png',
		x: DISPLAY.width - 70,
		y: DISPLAY.height - 150,
		width: 65,
		height: 100
	},
	{
		url: '/assets/environment/foliage/foliage_1B.png',
		x: 75,
		y: DISPLAY.height - 100,
		width: 100,
		height: 150
	},
	{
		url: '/assets/environment/foliage/foliage_1C.png',
		x: 300,
		y: DISPLAY.height - 150,
		width: 100,
		height: 125
	},
	{
		url: '/assets/environment/foliage/foliage_2A.png',
		x: DISPLAY.width - 250,
		y: DISPLAY.height - 200,
		width: 100,
		height: 125
	},
	{
		url: '/assets/environment/foliage/foliage_2B.png',
		x: 500,
		y: DISPLAY.height - 100,
		width: 100,
		height: 100
	},
	{
		url: '/assets/environment/foliage/foliage_2C.png',
		x: 25,
		y: DISPLAY.height - 200,
		width: 100,
		height: 125
	}
];

export const TREE_IMAGES: ImageLoaderData[] = [
	{
		url: '/assets/environment/trees/tree_1.png',
		x: 900,
		y: -200,
		z: 20,
		width: 670,
		height: 930
	},
	{
		url: '/assets/environment/trees/tree_2A.png',
		x: -200,
		y: -250,
		z: 20,
		width: 670,
		height: 930
	}
];
