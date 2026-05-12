import { Children } from 'src/modules/childrens/entities/children.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ParentAddress } from './parent-adress.entity';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column({ name: 'address_id' })
  addressId: string;

  @OneToOne(() => ParentAddress, (address) => address.parent, { cascade: true })
  @JoinColumn({ name: 'address_id' })
  address: ParentAddress;

  @OneToMany(() => Children, (children) => children.parent, { cascade: true })
  childrens: Children[];
}
