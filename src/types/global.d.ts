declare module '*.scss' {
	interface IClassNames {
		[className: string]: string;
	}
	const classNames: IClassNames;
	export = classNames;
}

declare module '*.svg' {
	import React from 'react';

	export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
	const src: string;
	const content: any;
	const viewBox: string;
	const width: string;
	const height: string;
	export default src;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
