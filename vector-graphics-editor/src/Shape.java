import java.awt.*;

public interface Shape {
    void draw(Graphics g);
    int getThickness();
    void setThickness(int thickness);
    Color getColour();
    void setColour(Color colour);
}
