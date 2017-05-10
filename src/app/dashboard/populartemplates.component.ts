import { Component, Input } from '@angular/core';

import { IntegrationTemplates } from '../model';

@Component({
  selector: 'syndesis-popular-templates',
  templateUrl: './populartemplates.component.html',
  styleUrls: [],
})
export class PopularTemplatesComponent {

  @Input() templates: IntegrationTemplates;

  @Input() loading: boolean;

}
