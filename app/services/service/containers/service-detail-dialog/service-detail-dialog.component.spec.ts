import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ServiceDetailDialogComponent } from './service-detail-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { MasterServiceService } from 'app/master/service/master-service/master-service.service';
import { UserService } from 'app/iam/user/user.service';
import { SnackBarService } from 'app/shared/services/snack-bar/snack-bar.service';
import { TestingModule } from 'app/testing/testing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ContentChange } from 'ngx-quill';
import { ServiceService } from '../../services/service.service';
import { DialogRef } from '@angular/cdk/dialog';

const MOCK_MAT_DIALOG_DATA: string = "1";

describe('ServiceDetailDialogComponent', () => {

    let component: ServiceDetailDialogComponent;
    let fixture: ComponentFixture<ServiceDetailDialogComponent>;
    let masterServiceServiceSpy: Spy<MasterServiceService>
    let userServiceSpy: Spy<UserService>
    let snackbarServiceSpy: Spy<SnackBarService>
    let serviceServiceSpy: Spy<ServiceService>
    let dialogRefSpy:Spy<DialogRef>

    beforeEach(waitForAsync(() => {

        masterServiceServiceSpy = createSpyFromClass(MasterServiceService)
        userServiceSpy = createSpyFromClass(UserService)
        snackbarServiceSpy = createSpyFromClass(SnackBarService)
        serviceServiceSpy = createSpyFromClass(ServiceService)
        dialogRefSpy=createSpyFromClass(DialogRef)

        masterServiceServiceSpy.fetchBy.nextWith({ id: 1, name: "TEST_SERVICE", active: true })
        userServiceSpy.getPermissions.nextWith(['services.service.detaildescription.update'])

        TestBed.configureTestingModule({
            declarations: [ServiceDetailDialogComponent],
            imports: [TestingModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: MOCK_MAT_DIALOG_DATA },
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: MasterServiceService, useValue: masterServiceServiceSpy },
                { provide: UserService, useValue: userServiceSpy },
                { provide: SnackBarService, useValue: snackbarServiceSpy },
                { provide: ServiceService, useValue: serviceServiceSpy }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ServiceDetailDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('submit', () => {
        it('should call update api and display success snackbar when submit SUCCESS', () => {
            masterServiceServiceSpy.update.nextWith()

            component.save()

            expect(masterServiceServiceSpy.update).toBeCalledTimes(1)
            expect(serviceServiceSpy.fetchAll).toBeCalledTimes(1)
            expect(dialogRefSpy.close).toBeCalledTimes(1)
            expect(snackbarServiceSpy.showInfo).toBeCalledWith('UPDATE_SERVICE_SUCCESS')
        })

        it('should call update api and display error snackbar when submit ERROR', () => {
            const error = new Error("ERROR")
            masterServiceServiceSpy.update.throwWith(error)

            component.save()

            expect(masterServiceServiceSpy.update).toBeCalledTimes(1)
            expect(serviceServiceSpy.fetchAll).toBeCalledTimes(0)
            expect(snackbarServiceSpy.showError).toBeCalledWith(error)
        })
    })

    it('cancel', () => {
        const testDetailDescription = 'test detail description'
        const testService = { name: 'TEST SERVICE', active: true, detailDescription: testDetailDescription }

        masterServiceServiceSpy.fetchBy.nextWith(testService)

        const patchValueSpy = jest.spyOn(component.quillForm, 'patchValue');
        const markPristineSpy = jest.spyOn(component.quillForm, 'markAsPristine');

        component.cancel()

        expect(patchValueSpy).toBeCalledWith({ content: testDetailDescription })
        expect(markPristineSpy).toBeCalledTimes(1)

        expect(component.quillForm.value).toEqual({ content: testDetailDescription })
        expect(component.quillForm.pristine).toBeTruthy()
    })

    it('open detail description', () => {
        const testDetailDescription = "test open detail description"
        component.serviceForm.patchValue({ detailDescription: testDetailDescription })

        const patchValueSpy = jest.spyOn(component.quillForm, 'patchValue');

        component.openDetailDescription()

        expect(component.showDetailDescription).toBeTruthy()
        expect(patchValueSpy).toBeCalledWith({ content: testDetailDescription })
    })

    it('close detail description', () => {
        component.closeDetailDescription()

        expect(component.showDetailDescription).toBeFalsy()
    })

    it('should set form value when content changed', () => {
        const demoHtml = "<p>test content</p>"
        component.contentChanged({ html: demoHtml } as ContentChange)

        expect(component.serviceForm.get("detailDescription")?.value).toEqual(demoHtml)
        expect(component.serviceForm.dirty).toBeTruthy()
    })

    it('should return detail description in service form', () => {
        const testDetailDescription = "test detail description"
        component.serviceForm.patchValue({ detailDescription: testDetailDescription })

        const detailDescriptionValue = component.getDetailDescription()

        expect(detailDescriptionValue).toEqual(testDetailDescription)
    })

    describe('is detail description empty', () => {
        it('return false if detail description has any content', () => {
            const testDetailDescription = "test detail description"
            component.serviceForm.patchValue({ detailDescription: testDetailDescription })
            const isEmpty = component.detailDescriptionEmpty()

            expect(isEmpty).toBeFalsy()
        })

        it('return true if detail description only contains spaces', () => {
            const testDetailDescription = "      "
            component.serviceForm.patchValue({ detailDescription: testDetailDescription })
            const isEmpty = component.detailDescriptionEmpty()

            expect(isEmpty).toBeTruthy()
        })

        it('return true if detail description is undefined', () => {
            const testDetailDescription = undefined
            component.serviceForm.patchValue({ detailDescription: testDetailDescription })
            const isEmpty = component.detailDescriptionEmpty()

            expect(isEmpty).toBeTruthy()
        })

        it('return true if detail description is null', () => {
            const testDetailDescription = null
            component.serviceForm.patchValue({ detailDescription: testDetailDescription })
            const isEmpty = component.detailDescriptionEmpty()

            expect(isEmpty).toBeTruthy()
        })
    })
});
