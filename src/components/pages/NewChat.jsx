import { forwardRef, useImperativeHandle, useRef } from "react";

const NewChat = forwardRef(({ chatToCreate }, ref) => {
        useImperativeHandle(ref, () => ({
          getData() {
            const form = formRef.current;
            if (!form || !form.reportValidity()) {
              return null;
            }
            return {
              reciever: form.reciever.value,
              msg: form.msg.value,
            };
          },
        }));
      
    const formRef = useRef();

    return (
        <form ref={formRef} className="p-4">
            <label htmlFor="reciever">To:</label><br/>
            <input className="form-control" type="text" id="reciever" name="reciever"/><br/>
            <label htmlFor="msg">Message:</label><br/>
            <textarea className="form-control" id="msg" name="msg" rows="3"></textarea><br/>

            <button type="submit" value="Submit" className="btn btn-primary mt-1">Submit</button>
        </form>
    );
});

export default NewChat;