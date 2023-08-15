import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserDto,
  PaginationDto,
  USER_SERVICE_NAME,
  UpdateUserDto,
  UserServiceClient,
} from '@app/common';
import { AUTH_SERVICE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  create(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  findAll() {
    return this.userService.findAllUsers({});
  }

  findOne(id: string) {
    return this.userService.findOneUser({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userService.updateUser({
      id,
      ...updateUserDto,
    });
  }

  remove(id: string) {
    return this.userService.removeUser({ id });
  }

  emailUsers() {
    const user$ = new ReplaySubject<PaginationDto>();

    user$.next({ page: 0, skip: 25 });
    user$.next({ page: 1, skip: 25 });
    user$.next({ page: 2, skip: 25 });
    user$.next({ page: 3, skip: 25 });

    user$.complete();

    let i = 0;

    this.userService.queryUsers(user$).subscribe((user) => {
      console.log('user chunk ', i, user);

      i++;
    });
  }
}
