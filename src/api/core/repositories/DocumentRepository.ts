

import { EntityRepository, Repository } from 'typeorm';
import { Document } from '../models/Document';

@EntityRepository(Document)
export class DocumentRepository extends Repository<Document> {
    // --
}
