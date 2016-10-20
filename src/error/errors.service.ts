import { Response } from '@angular/http';

export class ErrorsService {
    static extractMessage(error: any): string {
        let message: string;

        if (error instanceof String) {
            message = (<String>error).toString();
        } else if (error instanceof Response) {
            message = (<Response>error).text() || (<Response>error).statusText;
        } else if (error instanceof Error) {
            message = (<Error>error).message;
        }

        return message || JSON.stringify(error);
    }
}
