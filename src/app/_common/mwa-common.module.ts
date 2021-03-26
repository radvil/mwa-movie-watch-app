import { NgModule } from "@angular/core";
import { TruncatePipe } from "./pipes";

@NgModule({
  declarations: [TruncatePipe],
  exports: [TruncatePipe],
})
export class MwaCommonModule {}