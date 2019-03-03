import { NgModule } from '@angular/core';
import { TimerComponent } from './timer/timer';
import { UsersChatComponent } from './users-chat/users-chat';
@NgModule({
	declarations: [TimerComponent,
    UsersChatComponent,
    ],
	imports: [],
	exports: [TimerComponent,
    UsersChatComponent,
    ]
})
export class ComponentsModule {}
