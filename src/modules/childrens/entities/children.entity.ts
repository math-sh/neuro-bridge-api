import { Parent } from 'src/modules/parents/entities/parent.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Children {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'birth_date' })
  birthDate: Date;

  @Column()
  gender: string;

  @Column()
  support: number;

  @Column({ name: 'parent_id' })
  parentId: string;

  @ManyToOne(() => Parent, (parent) => parent.childrens)
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;
}
