loc_pic
        PUSH {R0, R4-R7}	;Push R0, R4, R5, R6, R7 onto the stack
	PUSH {R2, LR}		;Push R2 and the link register onto the stack
	POP  {R0, R6, LR}	;Pop R0, R6, and LR from the stack
	POP  {R0, R5, PC}	;Pop R0, R5, and PC from the stack
				;then branch to the new PC




loc_lll(int):
        str     fp, [sp, #-4]!
        add     fp, sp, #0
        sub     sp, sp, #12
        str     r0, [fp, #-8]
        mov     r3, #600
        mov     r0, r3
        add     sp, fp, #0
        ldr     fp, [sp], #4
        cmp r0, r1
        bne loc_start
        bx      lr ;<----------------- end of label/function
        
;test

loc_start:
    lop
    ldr r0a, adr_var1         
    ldr r1b, adr_var2         
    ldr r2c, [r0]             
    str r2d, [r1, r2, LSL#2]  
    str r2e, [r1, r2, LSL#2]!  
    ldr r3f, [r1], r2, LSL#2  
    pop         {r3, r4, pc}
    
    ;mov pc, lr
    
    ;bkpt ;<------------ end of label/function