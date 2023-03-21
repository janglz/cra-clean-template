export type BuildMode = 'production' | 'development';

export interface BuildEnv {
	mode: BuildMode;
	port: number;
}

export interface BuildPaths {
	entry: string;
	dist: string;
	src: string;
	public: string;
}

export interface BuildOptions {
	mode: BuildMode;
	paths: BuildPaths;
	isDev: boolean;
	port: number;
}
