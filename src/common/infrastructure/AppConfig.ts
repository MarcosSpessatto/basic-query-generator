import { singleton } from 'tsyringe';

const environmentVariables: any = {
  PORT: process.env.PORT,
  ORIGIN: process.env.ORIGIN,
};

type additionalVariablesType = {
  baseDir: string;
};

@singleton()
export class AppConfig {
  private environmentVariables = environmentVariables;

  public setup(additionalVariables: additionalVariablesType): any {
    this.validateEnvironmentVariables();
    return {
      port: this.environmentVariables.PORT,
      origin: this.environmentVariables.ORIGIN,
      ...additionalVariables,
    };
  }

  private validateEnvironmentVariables(): any {
    const missingVariables = Object.keys(this.environmentVariables).reduce((acc: string[], key: string) => {
      if (!this.environmentVariables[key]) {
        acc.push(key);
      }
      return acc;
    }, []);

    if (missingVariables.length) {
      throw new Error(`Missing environment variables: ${missingVariables.join(', ')}`);
    }
  }
}
