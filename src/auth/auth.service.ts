import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { User } from 'src/users/users.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email)

    if (user && (await compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user
      return result
    }

    return null
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id }
    return { access_token: this.jwtService.sign(payload) }
  }
}
