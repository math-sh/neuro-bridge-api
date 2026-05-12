import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Parent } from './parent.entity';

@Entity()
export class ParentAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column()
  neighborhood: string;

  @Column()
  number: string;

  @Column()
  complement: string;

  @OneToOne(() => Parent, (parent) => parent.address)
  parent: Parent;
}
