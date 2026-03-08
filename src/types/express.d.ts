// Source - https://stackoverflow.com/a/65848688
// Posted by manav, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-08, License - CC BY-SA 4.0

import * as express from "express"
declare global {
    namespace Express {
        interface Request {
            user? : Record<string,any>
        }
    }
}
